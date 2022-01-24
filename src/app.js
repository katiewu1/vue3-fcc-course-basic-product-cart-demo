let app = Vue.createApp({
  data() {
    return {
      showSidebar: false,
      inventory: [],
      // {
      //   carrots: 0,
      //   pineapples: 0,
      //   cherries: 0,
      // }
      cart: {},
      // {
      //   carrots: 0,
      //   pineapples: 0,
      //   cherries: 0,
      // },
    };
  },
  computed: {
    totalQuantity() {
      return Object.values(this.cart).reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    },
  },
  methods: {
    // addToCart(type) {
    //   // addToCart(type, quantity)
    //   // receive type and number
    //   // this.cart[type] += quantity;
    //   this.cart[type] += this.inventory[type];
    //   console.log(this.cart);
    // },
    addToCart(name, index) {
      if (!this.cart[name]) this.cart[name] = 0;
      // need to pass in the index when calling this addToCart function
      this.cart[name] += this.inventory[index].quantity;
      // clear the inputs/quantity by setting it to 0
      this.inventory[index].quantity = 0;
      // console.log(this.cart);
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    removeItem(name) {
      delete this.cart[name];
    },
  },
  async mounted() {
    const res = await fetch("./food.json");
    const data = await res.json();
    this.inventory = data;
  },
});

app.component("sidebar", {
  // receive the props in the sidebar components
  // can't mutate props/change the inventory/cart from this component
  // have to change it from the parent component -> the removeItem() function
  props: ["toggle", "cart", "inventory", "remove"],
  // mounted
  computed: {
    // use calculateTotal() as a method instead of computed
    // cartTotal() {
    //   return (this.cart.carrots * 4.82).toFixed(2);
    // },
  },
  methods: {
    getPrice(name) {
      const product = this.inventory.find((p) => {
        return p.name === name;
      });
      return product.price.USD;
    },
    calculateTotal() {
      // Object.keys -> get all the keys from the cart object
      const names = Object.keys(this.cart);
      // Object.values -> array of values out of an object
      // object.entries -> [key, value]
      // acc -> sum/total
      // curr -> current value
      const total = Object.entries(this.cart).reduce(
        (acc, curr, index) => {
          // return acc + curr * this.getPrice(names[index]); //Object.values
          // Object.entries -> curr[0] => key; curr[1] => value
          return acc + curr[1] * this.getPrice(curr[0]);
        },
        0 // initial value -> the accumulator will start at 0
        // if no items in this array (in the beginning), the number will just be 0 total
      );
      return total.toFixed(2);
    },
  },
  // line 205 - loop over an object, take three arguments item, key and index
  template: `
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity, key, i) in cart" :key="i">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{ key }}</td>
              <td>\${{ getPrice(key) }}</td>
              <td class="center">{{ quantity }}</td>
              <td>\${{ (quantity * getPrice(key)).toFixed(2) }}</td>
              <td class="center">
                <button @click="remove(key)" class="btn btn-light cart-remove">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong> \${{ calculateTotal() }} </span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
    `,
});
// v-if="Object.keys(cart) ->
// check the cart object length, if there are no keys on the cart object -> 0 (false value)

app.mount("#app");
