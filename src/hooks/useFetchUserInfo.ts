import { useEffect, useState } from 'react';
import { getLocalStorage } from '../util/localStorage';
import { UserInfo } from '../types/type';
import { ROUTE_PATH } from '../util/routes';
import { useNavigate } from 'react-router-dom';

export const useFetchUserInfo = () => {
  const navigate = useNavigate();
  const [userInfoParse, setUserInfoParse] = useState({
    userId: '',
    age: '',
    sex: '',
    bgn: '',
  });

  useEffect(() => {
    const userInfoJson = getLocalStorage('userInfo');
    const userInfo = JSON.parse(userInfoJson as string) as UserInfo;
    if (!userInfo) {
      window.alert('フェイスシートの登録がされていません。');
      navigate(ROUTE_PATH.FACE);
    }
    setUserInfoParse(userInfo);
  }, []);

  return userInfoParse;
};
