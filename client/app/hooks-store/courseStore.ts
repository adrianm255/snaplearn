import { Course } from "../types/course";
import { initStore } from "./store";

const configureStore = (initialState: Course) => {
  console.log('CONFIGURE COURSE STORE', initialState);
  const actions = [
    // TODO
  ];
  initStore(actions, initialState);
}

export default configureStore;