import { Request, Response } from 'express';
import Dog from '../models/Dog';
import Center from '../models/Center';
import { readStorage } from '../services/service';
const CenterPath = 'Data/storeCenters.json';
const DogPath = 'Data/storeDogs.json';
const express = require('express');
const app = express();
app.use(express.json());

// Using in routes/center.ts
export const filterCenter = async (filters: any, res: Response) => {
  const data = await readStorage(CenterPath);

  const filteredCenters = data.filter((center: any) => {
    let isValid = true;
    for (const key in filters) {
      console.log(key, center[key], filters[key]);
      isValid = isValid && center[key].includes(filters[key]);
    }
    return isValid;
  });
  res.send(filteredCenters);
};

// Using in routes/dog.ts
export const filterDog = async (filters: any, res: Response) => {
  const data = await readStorage(DogPath);
  const dataCenters = await readStorage(CenterPath);

  const filteredDogs = data.filter((dog: any) => {
    let isValid = true;
    for (const key in filters) {
      console.log(key, dog[key], filters[key]);

      if (filters[key] === '') {
        isValid;
      } else if (isNaN(filters[key])) {
        isValid = isValid && dog[key].includes(filters[key]);
      } else isValid = isValid && dog[key] == filters[key];
    }
    return isValid;
  });
  res.send(filteredDogs);
};
