import { CarLineCommon } from "./CarLineCommon";
import { ContactCommon } from "./ContactCommon";
import { ResourceObject } from "./ResourceObject";

export class WorkOrder extends ResourceObject {

    number: string;
    status: string;
    odometerMeasurement: string;
    odometerValue: number;
    gasAmount: number;
    notes: string;
    plateNumber: string;
    orderDate: string;
    carLine: CarLineCommon;
    contact: ContactCommon;
}