export const designationLevels = [
    {
        designation: "BEEO",
        scope: "Block"
    },
    {
        designation: "BPO",
        scope: "Block"
    },
    {
        designation: "BRCC Primary",
        scope: "Block"
    },
    {
        designation: "BRCC Upper Primary",
        scope: "Block"
    },
    {
        designation: "CHT(P)/CRCC(P)",
        scope: "Cluster"
    },
    {
        designation: "CHT(Sec)/CRCC(Sec)",
        scope: "Cluster"
    },
    {
        designation: "DIET Faculty",
        scope: "District"
    },
    {
        designation: "DIET Office",
        scope: "District"
    },
    {
        designation: "Deputy Director Elementary",
        scope: "District"
    },
    {
        designation: "Deputy Director Higher",
        scope: "District"
    },
    {
        designation: "Deputy Director Inspection Cadre",
        scope: "District"
    },
    {
        designation: "Director Higher Education",
        scope: "State"
    },
    {
        designation: "Directorate Elementary Education (office login)",
        scope: "State"
    },
    {
        designation: "Directorate Higher Education (office login)",
        scope: "State"
    },
    {
        designation: "District Project Officer",
        scope: "District"
    },
    {
        designation: "Joint Director Inspection Cadre",
        scope: "State"
    },
    {
        designation: "State Project Director",
        scope: "State"
    },
    {
        designation: "State Project Office",
        scope: "State"
    },
    {
        designation: "Test",
        scope: "State"
    },
    {
        designation: "Director Elementary Education",
        scope: "State"
    }
]


export const getLevelFromDesignation = (designation: string) => {
    const item = designationLevels.find((d) => designation === d.designation);
    return item?.scope;
}
export const getLowerDesignations = (_user: any) => {
    const user = _user?.user || null;
    if(!user){
        return [];
    }
    const level = user?.data?.roleData?.geographic_level;
    if (!level) {
        return [];
    }
    if (level === 'District') {
        return designationLevels.filter((a: any) => a.scope === 'District' || a.scope === 'Block' || a.scope === 'Cluster');
    }
    if (level === 'Block') {
        return designationLevels.filter((a: any) => a.scope === 'Block' || a.scope === 'Cluster');
    }
    if (level === 'Cluster') {
        return designationLevels.filter((a: any) => a.scope === 'Cluster');
    }
    return designationLevels;
}
export const getDistinctLevels = () => {
    const items: string[] = [];
    designationLevels.forEach((a) => {
            if (items.indexOf(a.scope) === -1) {
                items.push(a.scope);
            }
        }
    )
    return items;
}