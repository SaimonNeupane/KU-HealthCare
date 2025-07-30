import { ClipLoader } from "react-spinners";

const LoadingScreen = ({ ram }: { ram: any }) => {
  return <ClipLoader color="#10B981" size={ram} />;
};

export default LoadingScreen;
