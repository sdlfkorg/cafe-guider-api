

const client = feathers();

const restClient = feathers.rest().fetch(window.fetch.bind(window))
client.configure(restClient)

// Use localStorage to store our login token
client.configure(
  feathers.authentication({
    storage: window.localStorage
  })
)
const main = async () => {
    const CafeService = client.service('cafes')

try {
    const cafes = await CafeService.find({
        query:{
            $sort: {
                sn: -1,
            },
        }
        
    })
    console.log('find cafes', cafes)
  } catch (e) {
    console.log('find cafes error,', e)
  }

}

main()