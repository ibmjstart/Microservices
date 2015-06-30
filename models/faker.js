module.exports.fakeOut = function () {
  var jsf = require('json-schema-faker');

  var schema = {
    type: 'object',

    properties: {
      name: {
        type: 'string',
        faker: 'address.country'
      },
      price: {
        $ref: '#/definitions/price'
      },
      description: {
        type: 'string',
        faker: 'lorem.paragraph'
      },
      reviews: [
        {
          $ref: '#/definitions/review'
        },
        {
          $ref: '#/definitions/review'
        },
        {
          $ref: '#/definitions/review'
        }
      ]
    },

    required: ['price', 'name', 'image', 'description', 'reviews'],

    definitions: {
      price: {
        type: 'integer',
        minimum: 0,
        maximum: 1000,
      },
      star: {
        type: 'integer',
        minimum: 0,
        maximum: 5
      },
      review: {
        properties: {
          stars: {
            $ref: '#/definitions/star'
          },
          body: {
            type: 'string',
            faker: 'lorem.paragraph'
          },
          author: {
            type: 'string',
            format: 'email',
            faker: 'internet.email'
          },
          createdAt: {
            type: 'string',
            faker: 'date.past'
          }
        },
        required: ['stars', 'body', 'author', 'createdAt'],
      }
    }
  };

  var sample = jsf(schema);

  //console.log(sample.user.name);  
  return sample;
}