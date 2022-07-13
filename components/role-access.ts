import {ApplicationId as EsamvaadApplicationId} from "./esamaad-application";
import {ApplicationId as ShikshaSaathiApplicationId} from "./shiksha-application";

export const Permissions: any = {
    'State': {
        applications: {
            [EsamvaadApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            },
            [ShikshaSaathiApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            }
        },
        'schools': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        },
        'students': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        }
    },
    'District': {
        applications: {
            [EsamvaadApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            },
            [ShikshaSaathiApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            }
        },
        'schools': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        },
        'students': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        }
    },
    'Block': {
        applications: {
            [EsamvaadApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            },
            [ShikshaSaathiApplicationId]: {
                canCreate: true,
                canEdit: true,
                canRead: true,
            }
        },
        'schools': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        },
        'students': {
            canCreate: true,
            canEdit: true,
            canRead: true,
        }
    }
}