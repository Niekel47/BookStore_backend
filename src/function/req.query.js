// export const ListQueryReq = (req, _filter) => {
//   // Get data
//   const page = parseInt(req.query.page, 10) - 1 || 0;
//   const limit = parseInt(req.query.limit, 10) || 50;
//   const offset = parseInt(req.query.offset, 10) || page * limit;
//   const sort = req.query.sort || "id|desc";

//   // Parse filtering
//   const filter = {
//     ..._filter,
//   };

//   // Parse filter sorting
//   const order = {
//     orderBy: [],
//     include: {},
//   };
//   const sorts = sort.split(",");
//   sorts.forEach((sortItem, index) => {
//     if (sortItem.includes("|")) {
//       const s = sortItem.split("|");
//       if (s[0].includes(".")) {
//         const i = s[0].split(".");
//         const v = {};
//         v[i[0]] = i[1].toLowerCase();
//         order.include[i[0]].push(v);
//       } else {
//         const v = {};
//         v[s[0]] = s[1].toLowerCase();
//         order.orderBy.push(v);
//       }
//     }
//   });

//   return {
//     limit,
//     offset,
//     filter,
//     order,
//   };
// };
