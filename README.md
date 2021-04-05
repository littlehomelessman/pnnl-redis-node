# pnnl-redis-node

This service fetches the data from a local redis data-store supposed to be updated daily. The purpose of this service is to increase the responsiveness of our frontend.

Sample requests (data available from the passed one month to present day):

GET `http://localhost:5000/range/temperature/2021-03-16/2021-03-17`

GET `http://localhost:5000/day/temperature/2021-03-16`

For HTTPS:

GET `https://localhost:3443/range/temperature/2021-03-16/2021-03-20`

GET `https://localhost:3443/day/temperature/2021-03-16`
