import { useRouter } from "next/router";
import React from "react";
import Article from "../../components/Article";

function Category() {

  const {query} = useRouter();
  return query.name ? <Article type="normal" name={query.name} /> : null;
  
}

export default Category;