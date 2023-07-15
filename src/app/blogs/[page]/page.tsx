import Navigation from "@/components/header/Navbar";
import { getData } from "@/utils/fetch";
import React from "react";

async function getpost(id: string) {
  const res = await getData("/posts/" + id);
  
  return res.data;
}
const page = async ({ params }: { params: { page: string } }) => {
  const data = await getpost(params.page)
  let post;
  if (data) {
     post = <div>{data.title}</div>
  } else {
     post = <div>loading</div>
  }
  return <>
  <div className="bg-white">
      <Navigation />
      <div className="mx-auto p-3 max-w-7xl min-h-screen">
        <h2 className="text-2xl text-center font-semibold">{data.title}</h2>
        <div className="my-10 prose mx-auto flex justify-center" >
          {/* {data.body} */}
          <div dangerouslySetInnerHTML={{__html: data.body}}></div>
        </div>
        
      </div>
    </div>
 
  </>;
};

export default page;
