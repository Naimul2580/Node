import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../services/product.service";
import type { IProduct } from "../types/product";
import { bodyParser as bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  //   console.log(url);

  const method = req.method;
  const urlParams = url?.split("/");
  //   console.log(urlParams);

  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  //   console.log(id);

  //*Get All Products
  if (url === "/products" && method === "GET") {
    const products = productService();
    try {
      sendResponse(res, true, 200, "Product Retrived Successfully", products);
    } catch (error) {
      sendResponse(res, false, 500, "Internal Server Error", products);
    }
  } else if (method === "GET" && id !== null) {
    //* Get Single product

    const products = productService();
    const product = products.find((p: IProduct) => p.id === id);

    if (!product) {
      return sendResponse(res, false, 404, "Product Not Found");
    }

    sendResponse(res, true, 200, "Product Retrived Successfully", product);
  } else if (method === "POST" && url === "/products") {
    //* Create product

    const body = await bodyParser(req);
    const newProduct = {
      id: Date.now(),
      ...body,
    };

    const products = productService();
    products.push(newProduct);
    createProduct(products);

    sendResponse(
      res,
      true,
      201,
      "A Product has been Created Successfully",
      newProduct,
    );
  } else if (method === "PUT" && id !== null) {
    //* Update Product
    const body = await bodyParser(req);
    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index);

    if (index < 0) {
      return sendResponse(res, false, 404, "Product Not Found");
    }

    products[index] = {
      id: products[index].id,
      ...body,
    };

    createProduct(products);

    sendResponse(
      res,
      true,
      200,
      "Product Updated Successfully",
      products[index],
    );
  } else if (method === "DELETE" && id !== null) {
    //* Delete Product

    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index);

    if (index < 0) {
      return sendResponse(res, false, 404, "Product Not Found");
    }

    products.splice(index, 1);
    createProduct(products);

    sendResponse(res, true, 200, "Product Deleted Successfully");
  }
};

export default productController;
