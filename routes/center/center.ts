import { Request, Response } from 'express';
import Center from '../../models/Center';
import Dog from '../../models/Dog';
import Event from '../../models/Event';
import { updateStorage, readStorage } from '../../services/service';
import { registerCenterValidation } from '../../helpers/validation';
import { authentication } from '../../middlewares/authentication';
import { requiresAdmin } from '../../middlewares/requiresAdmin';
import { filterCenter } from '../../helpers/filter';
const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();
const app = express();
app.use(express.json());

//PATHS
const CenterPath = 'Data/storeCenters.json';
const DogPath = 'Data/storeDogs.json';
router.get('', (req: Request, res: Response) => {
  const filters: any = req.query;
  filterCenter(filters, res);
});

//GET SHOW CENTER BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const centers = await readStorage(CenterPath);
  const id = req.params.id;
  const center = centers.find((center) => center.id === id);
  if (center == undefined) {
    res.status(404).send("This center doesn't exist.");
  } else {
    res.status(200).send(center);
  }
});

//POST ADD NEW CENTER(ADMIN)
router.post(
  '',
  authentication,
  requiresAdmin,
  async (req: Request, res: Response) => {
    const centers: any = await readStorage(CenterPath);
    const center: Center = req.body;

    const name = (center.centerName = center.centerName.toLowerCase());
    const findSameName = centers.find((x: any) => x.centerName == name);

    const { error } = registerCenterValidation(center);
    if (error) return res.status(400).send('Invalid data, try again.');

    if (findSameName) {
      return res.status(400).send('This center already exists.');
    } else {
      center.id = uniqid();
      center.dogs = [] as Dog[];
      center.role = "center";
      center.events = [] as Event[];
      await updateStorage(CenterPath, [...centers, center]);
      return res.status(201).send(center);
    }
  }
);

//PUT UPDATE CENTER DATA(ADMIN)
router.put(
  '/:id',
  authentication,
  requiresAdmin,
  async (req: Request, res: Response) => {
    const centers: any = await readStorage(CenterPath);
    const newCenters = centers.filter((n: any) => n.id !== req.params.id);
    const oldCenter = centers.find(
      (center: any) => center.id === req.params.id
    );
    const newCenter: Center = req.body;

    const name = (newCenter.centerName = newCenter.centerName.toLowerCase());
    const findSameName = centers.find((x: any) => x.centerName == name);

    const centerIndex: number = centers.findIndex(
      (n: any) => n.id === req.params.id
    );
    const { error } = registerCenterValidation(newCenter);

    if (error) return res.status(400).send('Invalid data, try again.');
    if (oldCenter == undefined) {
      return res.status(404).send("This center doesn't exist.");
    }

    if (findSameName && req.params.id == oldCenter.id) {
      console.log(centerIndex);
      res
        .status(404)
        .send('A center with this name already exists, try again.');
    } else {
      console.log(centerIndex);
      newCenter.id = oldCenter.id;
      await updateStorage(CenterPath, [...newCenters, newCenter]);
      return res.status(201).send(newCenter);
    }
  }
);

//DELETE DELETE A CENTER(ADMIN)
router.delete(
  '/:id',
  authentication,
  requiresAdmin,
  async (req: Request, res: Response) => {
    const centers: any = await readStorage(CenterPath);
    const dogs: any = await readStorage(DogPath);
    const newCenters = centers.filter((n: any) => n.id !== req.params.id);
    const center = centers.find((center: any) => center.id === req.params.id);

    const newDogs = dogs.filter((n: any) => n.idCenter !== req.params.id);

    if (center == undefined) {
      return res.status(404).send("This center doesn't exist.");
    }
    await updateStorage(CenterPath, [...newCenters]);
    await updateStorage(DogPath, [...newDogs]);
    return res.status(400).send('Successfully deleted the center.');
  }
);
module.exports = router;
