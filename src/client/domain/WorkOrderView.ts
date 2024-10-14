
export class WorkOrderView {

    id: string;
    number: string;
    status: string;
    odometerMeasurement: string;
    odometerValue: number;
    gasAmount: number;
    notes: string;
    plateNumber: string;
    orderDate: string;
    carLineId?: string;
    carLineName?: string;
    contactId?: string;
    contactName?: string;
    contactType?: string;
    contactTaxId?: string;
}