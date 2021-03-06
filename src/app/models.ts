export interface WineSummary {
    _id: string,
    price: number,
    title: string
}

export interface WineDetails {
    _id: string,
    country: string,
    description: string,
    designation: string,
    points: number,
    price: number,
    province: string,
    region_1: string,
    region_2: string,
    taster_name: string,
    taster_twitter_handle: string,
    title: string,
    variety: string,
    winery: string
}