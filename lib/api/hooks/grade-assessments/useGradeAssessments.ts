import { useEffect, useState } from "react";
import { StorageService } from "../../../utility/storage-service";
import { client, clientGQL } from "../../client";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

type ReturnType = {
  grades: any[];
  isLoading: boolean;
  refresh: any;
  total: number;
  startRow: number;
  currentPage: number;
  pageSize: number;
};
export const GradeAssessmentQuery2 = `query($limit:Int, $offset: Int){
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
}`;

export const GradeAssessmentQuery = `query ($limit: Int, $offset: Int, $district: String, $block: String, $cluster: String, $type: String) {
  grade_assessment(limit: $limit, offset: $offset, where: {school: {location: {block: {_ilike: $block}, cluster: {_ilike: $cluster}, district: {_ilike: $district}} }, assessment: {type: {_ilike: $type}} }) {
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
    aggregate {
      count
    }
  }
}`;

    export const GradeAssessmentQuery3 = `query ($limit: Int, $offset: Int, $district: String, $block: String, $cluster: String, $gradeNumber: Int, $type: String) {
      grade_assessment(limit: $limit, offset: $offset, where: {school: {location: {block: {_ilike: $block}, cluster: {_ilike: $cluster}, district: {_ilike: $district}} }, grade_number: {_eq: $gradeNumber}, assessment: {type: {_ilike: $type}} }) {
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
        aggregate {
          count
        }
      }
    }`;
export type FilterType = {
  numberOfResults?: number;
  page?: number;
  [x: string]: any;
};
export const useGradeAssessments = ({
  numberOfResults,
  page,
}: FilterType = {}): ReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [startRow, setStartRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [grades, setGrades] = useState([] as any[]);
  const refresh = async ({
    numberOfResults: _numberOfResults_,
    page: _page_,
    queryString,
  }: FilterType = {}) => {
    try {
      setIsLoading(true);
      const _page = _page_ || 1;
      const _numberOfResults = _numberOfResults_ || 10;
      setStartRow(_numberOfResults * (_page - 1));
      setCurrentPage(_page);
      setPageSize(_numberOfResults);

      let response: any;
      console.log(queryString);
      console.log("=-=-=-");
      let params: any = {
        limit: _numberOfResults,
        offset: _numberOfResults * (_page - 1),
      };

      let q = GradeAssessmentQuery;
      // let q = temp;

      if (queryString.gradeNumber) {
        q = GradeAssessmentQuery3;
        params.gradeNumber = queryString.gradeNumber;
      }

      params.district = "%%";
      params.block = "%%";
      params.cluster = "%%";
      params.type = "%%";

      if (queryString.search) {
        params.type = queryString.search;
      }
      if (queryString._district) {
        params.district = queryString._district;
      }
      if (queryString._block) {
        params.block = queryString._block;
      }
      if (queryString._cluster) {
        params.cluster = queryString._cluster;
      }
      const res = await clientGQL(q, params);
      response = await res.json();
      console.log(response?.data);
      if (response?.data) {
        setTotal(response?.data?.grade_assessment_aggregate?.aggregate?.count);
        setGrades(response.data.grade_assessment);
      }
    } catch (e) {}
    setIsLoading(false);
  };
  useEffect(() => {
    refresh({ numberOfResults, page });
  }, []);
  return {
    grades,
    isLoading,
    total,
    refresh,
    pageSize,
    currentPage,
    startRow,
  };
};
