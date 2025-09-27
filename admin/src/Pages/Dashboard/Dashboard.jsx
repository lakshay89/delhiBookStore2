import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance, { getData } from "../../services/FetchNodeServices";

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Define state variables for data
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [levelImages, setLevelImages] = useState([]);
  const [userWishlists, setUserWishlists] = useState([]);
  const [rewardPoints, setRewardPoints] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupones, setCoupones] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [deliveryPartner, setDeliveryPartner] = useState([]);
  const [videos, setVideos] = useState([]);
  const [daySales, setDaySales] = useState([]); // Holds sales data for charts

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const usersResponse = await getData("api/v1/auth/get-all-users");

        if (usersResponse) {
          setUsers(usersResponse?.users);
        }
        // Fetch coupones data
        const couponesResponse = await axiosInstance.get(
          "/api/v1/coupon/get-all-coupons"
        );

        if (couponesResponse) {
          setCoupones(couponesResponse.data.data || []);
        }
        const shippingCostsResponse = await axiosInstance.get(
          "/api/v1/shipping/get-all-shipping-cost"
        );

        if (shippingCostsResponse) {
          setShippingCosts(shippingCostsResponse.data || []);
        }
        const deliveryPartnerResponse = await axiosInstance.get(
          "/api/v1/delivery-partner/get-all-divery-partners"
        );

        if (deliveryPartnerResponse) {
          setDeliveryPartner(deliveryPartnerResponse.data || []);
        }

        // Fetch banners data
        const bannersResponse = await getData("api/v1/banner/get-all-banners");
        if (bannersResponse) {
          setBanners(bannersResponse);
        }

        // Fetch categories data
        const categoriesResponse = await getData(
          "api/v1/category/get-all-categories"
        );
        if (categoriesResponse) {
          setCategories(categoriesResponse);
        }
        const subcategoriesResponse = await getData(
          "api/v1/subcategory/get-all-sub-categories"
        );
        if (subcategoriesResponse) {
          setSubCategories(subcategoriesResponse);
        }
        const levelImageResponse = await getData(
          "api/v1/level/get-all-levels"
        );
        if (levelImageResponse) {
          setLevelImages(levelImageResponse);
        }

        // // Fetch user Wishlist data
        // const userWishlistResponse = await getData('api/v1/video/get-all-videos');
        // if (userWishlistResponse) {
        //   setVideos(userWishlistResponse.videos);
        // }

        // Fetch reviews data
        const rewardPointsResponse = await getData(
          "api/v1/mainCategory/get-all-mainCategories"
        );
        if (rewardPointsResponse) {
          setRewardPoints(rewardPointsResponse || []);
        }

        // Fetch orders data
        const ordersResponse = await getData("api/v1/order/get-all-orders");
        if (ordersResponse) {
          setOrders(ordersResponse.orders);
        }
        // Fetch products data
        const productsResponse = await getData(
          "api/v1/product/get-products-count"
        );
        if (productsResponse) {
          setProducts(productsResponse.count || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []); // Empty dependency array ensures the fetch runs only once when the component mounts

  // const daySalesData = {
  //   labels: daySales.map(sale => sale.date), // Assuming 'date' is available in sales data
  //   datasets: [
  //     {
  //       label: "Sales",
  //       data: daySales.map(sale => sale.totalSales), // Assuming 'totalSales' contains sales amount
  //       fill: false,
  //       borderColor: "rgba(255,99,132,1)",
  //       tension: 0.1,
  //     },
  //   ],
  // };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Delhi Book Store Admin Panel</h1>
        <p>Manage your Delhi Book Store store data from here!</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <Link to="/all-orders">
            <i className="fa-solid fa-truck"></i>
            <h3>Manage Orders</h3>
            <p>Track and manage your customer orders</p>
            <p>{orders?.length} Orders</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-banners">
            <i className="fa-regular fa-images"></i>
            <h3>Manage Banners</h3>
            <p>Update your website's banners</p>
            <p>{banners?.length} Banners</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-maincategory">
            <i className="fa-solid fa-sitemap"></i>
            <h3>Manage Main Category</h3>
            <p>Add, update, or remove main category</p>
            <p>{rewardPoints?.length} Main Category</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-category">
            <i className="fa-solid fa-layer-group"></i>
            <h3>Manage Category</h3>
            <p>Manage Category of your products</p>
            <p>{categories?.length} Category</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-sub-category">
            <i className="fa-solid fa-th-large"></i>
            <h3>Manage Sub Category</h3>
            <p>Manage Sub Category of your products</p>
            <p>{subCategories?.length} Sub Category</p>
          </Link>
        </div>
          <div className="dashboard-card">
          <Link to="/all-products">
            <i className="fa-solid fa-boxes-stacked"></i>
            <h3>Manage Products</h3>
            <p>Add, update, or remove products</p>
            <p>{products || "...loading"} Products</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-level-images">
            <i className="	fa-solid fa-signal"></i>
            <h3>Manage Level Images</h3>
            <p>Manage Level Images of your products</p>
            <p>{levelImages?.length} Level Images</p>
          </Link>
        </div>

       

      
 <div className="dashboard-card">
          <Link to="/all-inquiries">
            <i className="fa-solid fa-envelope-open-text"></i>
            <h3>Manage Inquiry</h3>
            <p>Add, update, or remove inquiry </p>
            <p>{rewardPoints?.length || 0} Inquiry</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-users">
            <i className="fa-solid fa-users"></i>
            <h3>All Users</h3>
            <p>View and manage users</p>
            <p>{users?.length} Users</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-coupon">
            <i className="fa-solid fa-tags"></i>
            <h3>All Coupons</h3>
            <p>View and manage coupons</p>
            <p>{coupones?.length} Coupons</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-shipping-cost">
            <i className="fa-solid fa-box"></i>
            <h3>All Shipping Cost</h3>
            <p>View and manage shipping cost</p>
            <p>{shippingCosts?.length} Shipping Costs</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/all-delivery-partners">
            <i className="fa-solid fa-people-carry-box"></i>
            <h3>All Delivery Partners</h3>
            <p>View and manage delivery partner</p>
            <p>{deliveryPartner?.length} delivery partners</p>
          </Link>
        </div>
      </div>

      {/* Graphs (Optional) */}
      {/* <div className="dashboard-card">
        <h3>Day by Day Sales</h3>
        <p>Overview of your sales</p>
        <Line data={daySalesData} />
      </div> */}
    </div>
  );
};

export default Dashboard;
