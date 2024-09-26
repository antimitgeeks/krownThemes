import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard';
import { useGetDashboardInvoiceListQuery, useGetMonthlyAnalysisQuery } from '../../services/DashboardService';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { useGetIndividualInvoiceListQuery } from '../../services/AdminService';
import { useGetProfileQuery } from '../../services/ProfileService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DashboardWrapper() {

  const [loading, setLoading] = useState(false);
  const [ListData, setListData] = useState([]);
  const [OverViewData, setOverViewData] = useState([]);
  const [overviewLoading, setOverViewLoading] = useState(false);
  const navigate = useNavigate()
  const [count, setCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const userToken = Cookies.get("isLogged");
  const [userId, setUserId] = useState('');
  const [searchFilter,setSearchFilter] = useState('');

  const ReduxData = useSelector((state) => state.SearchSlice);

  useEffect(()=>
  {
    setSearchFilter(ReduxData?.customerInvoiceQuery)
  },[ReduxData])

  const dataPerPage = 10;

  const { data: profileData, isLoading: listLoading, isFetching: listFetching } = useGetProfileQuery({});

  useEffect(() => {
    const prevData = Cookies.get("profileData");

    if (prevData?.length > 10) {
      console.log("")
    }
    else {
      Cookies.set("profileData", `${JSON.stringify(profileData?.result?.result)}`, { expires: 30 });
    }
  }, [profileData, listLoading, listFetching])


  useEffect(() => {
    if (userToken) {
      const token = jwtDecode(userToken);
      console.log(token?.id, 'tokenn');
      setUserId(token?.id);
    }
    if (!userToken || userToken === null) {
      navigate('/');
      console.log('navigating')
    }
    console.log('navigating!')

  }, [userToken])

  // const { data, isLoading, isFetching } = useGetDashboardInvoiceListQuery({});
  const { data, isLoading, isFetching } = useGetIndividualInvoiceListQuery({
    Id: userId, data: {
      limit: dataPerPage,
      page: currentPage,
      search:searchFilter
    }
  });


  useEffect(() => {
    if (isLoading || isFetching) {
      setLoading(true);
    }
    else {
      setLoading(false);
      setListData(data?.result)
      setCount(Math.ceil(data?.result?.result?.count / dataPerPage))
    }
  }, [isLoading, isFetching, data])

  console.log(data?.result, 'invoice list');


  //////// fetching monthly analysis ////////


  const { data: analysisData, isFetching: isAnalysisFetching, isLoading: isAnalysisLoading } = useGetMonthlyAnalysisQuery({
    data: {
      "month": "09",
      "year": "2024"
    },
    Id: userId
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
      <Dashboard loading={loading} listData={ListData?.result} overviewLoading={overviewLoading} overviewData={OverViewData} setCurrentPage={setCurrentPage} currentPage={currentPage} count={count} />
    </div>
  )
}

export default DashboardWrapper;