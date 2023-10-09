import { Counter } from "../models/threadModel.js";

export default async function uniqueIdGeneration() {
  const idLength = 8;
  const counter = await Counter.findOneAndUpdate(
    {},
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );

  const newId = counter.value.toString().padStart(idLength, "0");
  return newId;
}
