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

export const tempQuery = `query ($limit: Int, $offset: Int, $grade_assessmentWhere: grade_assessment_bool_exp) {
  grade_assessment(limit: $limit, offset: $offset, where: $grade_assessmentWhere) {
    school {
      location {
        block
        district
        cluster
      }
    }
    assessment {
      type
      created
      assessment_type {
        name
      }
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

      const temp: any = {
        district: "%%",
        block: "%%",
        cluster: "%%",
        udise: {},
        type: "%%",
        gradeNumber: {},
      };

      if (queryString.gradeNumber) {
        temp.gradeNumber = { _eq: queryString.gradeNumber };
      }
      if (queryString.search) {
        if (isNaN(queryString.search)) {
          temp.type = "%" + queryString.search + "%";
        } else {
          temp.udise = { _eq: queryString.search };
        }
      }
      if (queryString._district) {
        temp.district = queryString._district;
      }
      if (queryString._block) {
        temp.block = queryString._block;
      }
      if (queryString._cluster) {
        temp.cluster = queryString._cluster;
      }
      params.grade_assessmentWhere = {
        grade_number: temp.gradeNumber,
        assessment: {
          type: {
            _ilike: temp.type,
          },
        },
        school: {
          udise:temp.udise,
          location: {
            block: {
              _ilike: temp.block,
            },
            district: {
              _ilike: temp.district,
            },
            cluster: {
              _ilike: temp.cluster,
            },
          },
        },
      };

      let q = tempQuery;
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
