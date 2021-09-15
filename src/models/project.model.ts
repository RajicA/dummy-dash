export interface Project {
    id: number;
    order: number;
    name: string;
    image?: {
        imgUrl: string;
        depthUrl: string;
    };
}
