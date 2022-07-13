import data from './district-block-cluster.json';
import {getLevelFromDesignation} from "./designation-level";

export const AllDistrictBlockClusters = data;
export const getAllDistricts = (district?: string, user?: any) => {
    const level = user?.data?.roleData?.geographic_level;
    if (level === 'District' || level === 'Block' || level === 'Cluster' && user?.data?.roleData?.district !== 'ALL') {
        // @ts-ignore
        return [...new Set(data.filter(item => item.District === user?.data?.roleData?.district).map(item => item.District))];
    }
    // @ts-ignore
    return [...new Set(data.map(item => item.District))];
}
export const getBlocks = (district: string, block?: string, user?: any) => {
    const level = user?.data?.roleData?.geographic_level;
    if (level === 'Block' || level === 'Cluster' && user?.data?.roleData?.block !== 'ALL') {
        // @ts-ignore
        return [...new Set(data.filter(item => item.District === district).filter(item => item.Block === user?.data?.roleData?.block).map(item => item.Block))];
    }
    // @ts-ignore
    return [...new Set(data.filter(item => item.District === district).map(item => item.Block))];
}
export const getClusters = (block: string, cluster?: string,user?:any) => {
    const level = user?.data?.roleData?.geographic_level;
    if ( level === 'Cluster' && user?.data?.roleData?.cluster !== 'ALL') {
        // @ts-ignore
        return [...new Set(data.filter(item => item.Block === block).filter(item => item.Cluster === user?.data?.roleData?.cluster).map(item => item.Cluster))];
    }
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