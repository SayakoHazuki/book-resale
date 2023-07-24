import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

type cbool = "是" | "否";

interface Database {
  public: {
    tables: {
      books: {
        Row: IBook;
        Insert: IBook;
        Update: IBook;
      };
    };
  };
}

interface IBook {
  pyccode: string; // Seller Name
  contact_wts: string | null; // Seller Contact whatsapp (optional)
  contact_ins: string | null;
  contact_sig: string | null;
  contact_other: string | null;
  book_title: string;
  book_photo: string; // google drive link for 1 photo
  book_photo_alt: string | null; // google drive link for multiple alternative photos
  book_price: string; // only the number, in HKD
  situation_broken: cbool; //
  situation_pen: cbool;
  situation_highlight: cbool;
  situation_pencil: cbool;
  situation_filled: cbool;
  desc_situation: string;
  desc_attachments: string;
  desc_more: string;
}
// postgresql://postgres:[YOUR-PASSWORD]@db.wigtztulrpybebvqootn.supabase.co:5432/postgres
// api key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ3R6dHVscnB5YmVidnFvb3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkzNTY3MTIsImV4cCI6MjAwNDkzMjcxMn0.B5b8v0T1Y8NhGMVr_y_iNZK457pkEvmOexrEA84Kr4A
// supabase url: https://wigtztulrpybebvqootn.supabase.co

async function load_books() {
  const supabase = createClient<Database>(
    "https://wigtztulrpybebvqootn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ3R6dHVscnB5YmVidnFvb3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkzNTY3MTIsImV4cCI6MjAwNDkzMjcxMn0.B5b8v0T1Y8NhGMVr_y_iNZK457pkEvmOexrEA84Kr4A"
  );
  return await supabase
    .from("books")
    .select<"*", IBook>("*")
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
        return [];
      }
      return data;
    });
}

export default function Home() {
  return (
    <main className="flex flex-col justify-center min-h-screen py-2">
      <div className="flex flex-wrap justify-center max-w-6xl mx-auto">
        {load_books().then((books) => {
          return books.map((book, i) => {
            return (
              <div
                key={i}
                className="w-2/5 rounded overflow-hidden shadow-lg m-4"
              >
                <Image
                  className="w-full"
                  src={`https://drive.google.com/uc?export=view&id=${
                    book.book_photo.split("id=")[1].split("&")[0]
                  }`}
                  alt={book.book_title}
                  width={300}
                  height={300}
                ></Image>
                <div className="px-4 py-4">
                  <div className="font-bold text-base mb-2">
                    {book.book_title}
                  </div>
                  <p className="text-gray-700 text-sm">HKD {book.book_price}</p>
                </div>
                <div className="px-4 pt-4 pb-2 text-xs">
                  {[
                    { wts: book.contact_wts },
                    { ins: book.contact_ins },
                    { sig: book.contact_sig },
                    { other: book.contact_other },
                  ].map((contact, i) => {
                    return Object.values(contact)[0] ? (
                      <span
                        key={i}
                        className="inline-block bg-gray-200 rounded-full my-1 px-3 py-1 text-xs font-semibold text-gray-700 mr-2 "
                      >
                        {Object.keys(contact)[0]}: {Object.values(contact)[0]}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            );
          });
        })}
      </div>
    </main>
  );
}
