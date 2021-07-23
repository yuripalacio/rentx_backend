import { container } from "tsyringe";
import { IDateProvider } from "./IDateProvider";
import { DayjsDateProvider } from "./implementations/DayjsDateProvider";

const dateProvider = {
  dayjs: DayjsDateProvider,
};

container.registerSingleton<IDateProvider>(
  "DateProvider",
  dateProvider[process.env.DATE_PROVIDER]
);
