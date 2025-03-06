import fs from 'fs';
import path from 'path';
import { UserData } from '../Models/User';

const usersFilePath = path.join(__dirname, '..', 'users.json');

export const readDataFromFile = (): UserData[] => {
  try {
    const rawData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading the JSON file:', err);
    return [];
  }
};

export const writeDataToFile = (data: UserData[]): void => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to the JSON file:', err);
  }
};

export const addNewUser = (newUser: UserData): void => {
  const users = readDataFromFile();
  users.push(newUser);
  writeDataToFile(users);
};

export const getAllUsers = (): UserData[] => {
  return readDataFromFile();
};
