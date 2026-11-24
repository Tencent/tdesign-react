import React from 'react';
import { ChevronLeftIcon } from 'tdesign-icons-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const THeader = (prop) => {
  const { title } = prop;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const showNavBack = !!searchParams.get('showNavBack');

  const navBack = () => navigate(-1);

  return (
    <>
      {title ? (
        <div className="tdesign-demo-topnav">
          <div className="tdesign-demo-topnav-title">{title}</div>
          {showNavBack && <ChevronLeftIcon className="tdesign-demo-topnav__back" onClick={navBack} />}
        </div>
      ) : null}
    </>
  );
};

export default THeader;
