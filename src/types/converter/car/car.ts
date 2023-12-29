import { CarResponse } from 'src/types/network/response/car/car'
import { CarForm } from 'src/types/domain/car/car'
import { CarPayload } from 'src/types/network/payload/car/car'

export function carResponseToForm(data: CarResponse): CarForm {
  return {
    token: data.token,
    title: data.title,
    time: data.time,
    location: data.location,
    kilometer: data.kilometer,
    year: data.year,
    color: data.color,
    adType: data.ad_type,
    model: data.model,
    fuel: data.fuel,
    engine: data.engine,
    chassis: data.chassis,
    chassisFront: data.chassis_front,
    chassisBack: data.chassis_back,
    body: data.body,
    insurance: data.insurance,
    gearbox: data.gearbox,
    canExchange: data.can_exchange,
    price: data.price,
    phone: data.phone,
    status: data.status,
    description: data.description,
    appointment: data.appointment,
    sellerType: data.seller_type,
    myDescription: data.my_description,
  }
}

export function carFormToPayload(form: CarForm): CarPayload {
  return {
    token: form.token,
    title: form.title,
    time: form.time,
    location: form.location,
    kilometer: form.kilometer,
    year: form.year,
    color: form.color,
    ad_type: form.adType,
    model: form.model,
    fuel: form.fuel,
    engine: form.engine,
    chassis: form.chassis,
    chassis_front: form.chassisFront,
    chassis_back: form.chassisBack,
    body: form.body,
    insurance: form.insurance,
    gearbox: form.gearbox,
    can_exchange: form.canExchange,
    price: form.price,
    phone: form.phone,
    status: form.status,
    description: form.description,
    appointment: form.appointment,
    seller_type: form.sellerType,
    my_description: form.myDescription,
  }
}
