import data from './district-block-cluster.json';
import {getLevelFromDesignation} from "./designation-level";

export const AllDistrictBlockClusters = data;
export const getAllDistricts = (district?: string) => {
    // @ts-ignore
    return [...new Set(data.map(item => item.District))];
}
export const getBlocks = (district: string, block?: string) => {
    // @ts-ignore
    return [...new Set(data.filter(item => item.District === district).map(item => item.Block))];
}
export const getClusters = (block: string, cluster?: string) => {
    // @ts-ignore
    return [...new Set(data.filter(item => item.Block === block).map(item => item.Cluster))];
}
export const getVisibility = (designation: string, level: string) => {
    if (!getLevelFromDesignation(designation)) {
        return false;
    }
    switch (getLevelFromDesignation(designation)) {
        case 'District':
            return level === 'District';
        case 'Block':
            return level === 'District' || level === 'Block';
        case 'Cluster':
            return level === 'District' || level === 'Block' || level === 'Cluster';
    }
    return false;
}