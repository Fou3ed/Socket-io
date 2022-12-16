class simpleFetch{
   // Make GET Request
   async get(url, headers) {
    const response = await fetch(url, { headers: { ...headers } });
    const resData = await response.json();
    return resData;
  }

}