import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard';
import { useGetDashboardInvoiceListQuery, useGetMonthlyAnalysisQuery } from '../../services/DashboardService';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { useGetIndividualInvoiceListQuery } from '../../services/AdminService';

function DashboardWrapper() {

  const [loading, setLoading] = useState(false);
  const [ListData, setListData] = useState([]);
  const [OverViewData, setOverViewData] = useState([]);
  const [overviewLoading, setOverViewLoading] = useState(false);

  const userToken = Cookies.get("isLogged");
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (userToken) {
      const token = jwtDecode(userToken);
      console.log(token?.id, 'tokenn');
      setUserId(token?.id)
    }
  }, [userToken])

  // const { data, isLoading, isFetching } = useGetDashboardInvoiceListQuery({});
  const { data, isLoading, isFetching } = useGetIndividualInvoiceListQuery({ Id: userId });


  useEffect(() => {
    if (isLoading || isFetching) {
      setLoading(true);
    }
    else {
      setLoading(false);
      setListData(data?.result)
    }
  }, [isLoading, isFetching])

  console.log(data?.result, 'userList');


  //////// fetching monthly analysis ////////


  const { data: analysisData, isFetching: isAnalysisFetching, isLoading: isAnalysisLoading } = useGetMonthlyAnalysisQuery({
    data: {
      "month": "09",
      "year": "2024"
    }
  }
  )

  useEffect(() => {
    if (isAnalysisFetching || isAnalysisLoading) {
      setOverViewLoading(true);
    }
    else {
      setOverViewLoading(false);
      setOverViewData(analysisData?.result)
    }

  }, [analysisData, isAnalysisFetching, isAnalysisLoading])


  return (
    <div className="page-body px-4 h-full pb-5">
      <Dashboard loading={loading} listData={ListData?.result} overviewLoading={overviewLoading} overviewData={OverViewData} />
    </div>
  )
}

export default DashboardWrapper;