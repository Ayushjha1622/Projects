import { useDispatch } from "react-redux";
import { addCollection, addedToast } from "../redux/features/collectionSlice";




const ResultCard = ({ item }) => {

  const dispatch = useDispatch()

  const addToCollection = (item) =>{
    
    dispatch(addCollection(item))
    dispatch(addedToast(item))
    
  }
  return (
    <div className="w-[18vw] relative h-80 bg-white rounded-xl overflow-hidden">
      <div className="h-full">
        {item.type == "photo" ? (
          <img
            className="h-full w-full object-cover object-center"
            src={item.src}
            alt=""
          />
        ) : (
          ""
        )}
        {item.type == "video" ? (
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            src={item.src}
          ></video>
        ) : (
          ""
        )}
      </div>
      <div id="bottom" className="flex gap-2 justify-between items-center w-full px-4 py-10 absolute bottom-0">
      <h2 classname="text-lg font-semibold capitalize h-12 overflow-hidden">
        {item.title}
      </h2>

      <button
      onClick={()=>{
        addToCollection(item)
      }}
       className="bg-indigo-600 text-white rounded px-3 py-1 cursor-pointer font-medium scale-95">Save</button>
      </div>
    </div>
  );
};

export default ResultCard;
