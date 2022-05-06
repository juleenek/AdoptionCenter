import express from 'express';
import fs from 'fs';

import Center from '../Models/Center';
import Dog from '../Models/Dog';
import User from '../Models/User';
import Event from '../Models/Event';

const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';
const storeDogsFile = '../AdoptionCenter/Data/storeDogs.json';
const storeEventsFile = '../AdoptionCenter/Data/storeEvents.json';
const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

export let centers: Center[] = [];
export let dogs: Dog[] = [];
export let events: Event[] = [];
export let users: User[] = [];

export const secret = 'LubiePieski123';

export class Service {
  public async updateStorage(): Promise<void> {
    const dataCenters = { centers };
    const dataDogs = { dogs };
    const dataEvents = { events };
    const dataUsers = { users };
    try {
      await fs.promises.writeFile(
        storeCentersFile,
        JSON.stringify(dataCenters)
      );
      await fs.promises.writeFile(storeDogsFile, JSON.stringify(dataDogs));
      await fs.promises.writeFile(storeEventsFile, JSON.stringify(dataEvents));
      await fs.promises.writeFile(storeUsersFile, JSON.stringify(dataUsers));
    } catch (err) {
      console.log(err);
    }
  }
  public async readStorage(): Promise<void> {
    try {
      const dataCenters = await fs.promises.readFile(storeCentersFile, 'utf-8');
      const dataDogs = await fs.promises.readFile(storeDogsFile, 'utf-8');
      const dataEvents = await fs.promises.readFile(storeEventsFile, 'utf-8');
      const dataUsers = await fs.promises.readFile(storeUsersFile, 'utf-8');

      centers = JSON.parse(dataCenters).centers;
      dogs = JSON.parse(dataDogs).dogs;
      events = JSON.parse(dataEvents).events;
      users = JSON.parse(dataUsers).users;
    } catch (err) {
      console.log(err);
    }
  }
}
