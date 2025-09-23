import "./script/components/index.js";

import RecommendedPackages from "./script/data/local/recommendedPackages.js";
import PurchaseHistory from "./script/data/local/purchaseHistory.js";

const main = () => {
  const recommendationsGrid = document.querySelector(".recommendations-grid");
  const historyList = document.querySelector(".history-list");

  recommendationsGrid.innerHTML = "";
  // historyList.innerHTML = "";

  const packages = RecommendedPackages.getAll();
  const history = PurchaseHistory.getAll();

  packages.forEach((pkg) => {
    const packageItemElement = document.createElement("package-item");

    packageItemElement.package = pkg;

    recommendationsGrid.appendChild(packageItemElement);
  });
};

document.addEventListener("DOMContentLoaded", main);
