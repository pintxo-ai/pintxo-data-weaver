import { Input } from "./input.interface";

export interface DataProcessingProcessor {
  processData(message: any): Input;
}
