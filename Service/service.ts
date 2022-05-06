import express from 'express';
import fs from 'fs';

import Center from '../models/Center';
import Dog from '../models/Dog';
import User from '../models/User';
import Event from '../models/Event';

// const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';
// const storeDogsFile = '../AdoptionCenter/Data/storeDogs.json';
// const storeEventsFile = '../AdoptionCenter/Data/storeEvents.json';
// const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

export const secret = 'LubiePieski123';

export async function updateStorage<DataType extends Center | Dog | Event | User> (
  storeFile: string,
  data: DataType[]
): Promise<void> {
  try {
    await fs.promises.writeFile(storeFile, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
}

export async function readStorage<DataType extends Center | Dog | Event | User> (file: string): Promise<DataType[]> {
  try {
    const data = await fs.promises.readFile(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}
