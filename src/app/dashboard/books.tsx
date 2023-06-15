import React, { useEffect, useState } from "react";
import Logged from "../../components/layouts/Logged";
import { getCookie } from "cookies-next";
import axios from "axios";
import Image from "next/image";


const apihost = process.env.API_HOST;
const Books = () => {
  const [books, setbooks] = useState([]);
  const token = getCookie("token");

  async function getBooks() {
    var config = {
      method: "GET",
      url: apihost + "/api/v1/books",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios(config);
      setbooks(response.data);
      console.log(books);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <Logged>
      <div className="">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h1>Books</h1>
        </div>
        {/* <div>Add Books</div> */}
        <div className="grid grid-rows-4 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-full shadow-xl bg-white rounded-lg mt-4"
            >
              <figure className="px-10 pt-10">
                <Image
                  src="https://placeimg.com/400/225/arch"
                  alt="Shoes"
                  className="rounded-xl"
                  width={200}
                  height={200}
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{book.title}</h2>
                <p>{book.desc}</p>
                <div className="card-actions">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Logged>
  );
};

export default Books;
