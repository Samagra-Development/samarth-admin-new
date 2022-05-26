import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client, clientGQL} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

type ReturnType = {
    grades: any[]
    isLoading: boolean
    refresh: any
    total: number
    startRow: number
    currentPage: number
    pageSize: number
}
export const GradeAssessmentQuery = `query($limit:Int, $offset: Int){
  grade_assessment (limit:$limit,offset:$offset){
    assessment {
      type
    }
    grade_number
    section
    stream {
      tag
    }
    id
    created
    updated
    school {
      udise
    }
  }
    grade_assessment_aggregate {
    aggregate{
    count
    }
}
}
`
export type FilterType = {
    numberOfResults?: number,
    page?: number,
    [x: string]: any
}
export const useGradeAssessments = ({numberOfResults, page}: FilterType = {}): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [startRow, setStartRow] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [grades, setGrades] = useState([] as any[]);
    const refresh = async ({
                               numberOfResults: _numberOfResults_,
                               page: _page_,
                           }: FilterType = {}) => {
        try {
            setIsLoading(true)
            const _page = _page_ || 1;
            const _numberOfResults = _numberOfResults_ || 10;
            setStartRow(_numberOfResults * (_page - 1));
            setCurrentPage(_page);
            setPageSize(_numberOfResults);


            const res = await clientGQL(GradeAssessmentQuery, {
                limit: _numberOfResults,
                offset: _numberOfResults * (_page - 1),
            })
            const response = await res.json();
            console.log(response?.data);
            if (response?.data) {
                setTotal(response?.data?.grade_assessment_aggregate?.aggregate?.count);
                setGrades(response.data.grade_assessment)
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        refresh({numberOfResults, page})
    }, [])
    return {
        grades,
        isLoading,
        total,
        refresh,
        pageSize,
        currentPage,
        startRow
    }
}
