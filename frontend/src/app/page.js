import React from "react";
import Webfeature from "../components/Webfeature/Webfeature";

import FilterCatgory1 from "../components/CategoryByImage/FilterCatgory1";
import FilterCatgory2 from "../components/CategoryByImage/FilterCatgory2";

import HomeBanner from "../components/HomeBanner/HomeBanner";
import FilterCatgory3 from "../components/CategoryByImage/FilterCategory3";
import NewArrival from "../components/NewArrival/NewArrival";
import Featureproduct from "../components/FeatureProduct/Featureproduct";
import BestSeller from "../components/BestSeller/BestSeller";
import Testimonail from "../components/Testimonail/Testimonail";
import StyleBanner1 from "../components/StyleBanner/StyleBanner1";
import AllCategory from "../components/Category/AllCategory";
import AddImageShowHomePage from "../components/AddImageShowHomePage/AddImageShowHomePage";

const page = () => {
  return (
    <>
      <HomeBanner />
      <AllCategory />
      <FilterCatgory1 />
      <Webfeature />
      <NewArrival />
      <FilterCatgory2 />
      <Featureproduct productlength={9} btnlength={9} />
      <FilterCatgory3 />
      <BestSeller productlength={12} btnlength={12} />
      <StyleBanner1 />
      <Testimonail />
      <AddImageShowHomePage />
    </>
  );
};

export default page;
