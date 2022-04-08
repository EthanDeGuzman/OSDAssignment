export interface Games {
    id,
    game: {
        title: string,
        company : { name : string, year_formed : string, founders: string},
        year_release: number,
        description: string,
        price: number,
        rating: string;
    }
}
