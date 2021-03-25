# pnnl-redis-node

This service fetches the data from a local redis data-store supposed to be updated daily. The purpose of this service is to increase the responsiveness of our frontend.

Sample requests:

GET `http://localhost:5000/range/temperature/2021-02-16/2021-02-17`

GET `http://localhost:5000/day/temperature/2021-02-16`
