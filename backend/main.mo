import Text "mo:core/Text";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

actor {
  let listings = Map.empty<Text, Listing>();
  let orders = Map.empty<Text, Order>();

  let adminPin = "1234";

  type Listing = {
    id : Text;
    title : Text;
    description : Text;
    originalPrice : Float;
    dealPrice : Float;
    category : Category;
    imageUrl : Text;
    stockQuantity : Int;
    expiryTimestamp : ?Int;
    isActive : Bool;
  };

  type Category = {
    #deal;
    #loot;
    #offer;
    #flashSale;
    #quickSale;
    #resell;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #fulfilled;
    #cancelled;
  };

  type Order = {
    id : Text;
    listingId : Text;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    quantity : Int;
    timestamp : Int;
    status : OrderStatus;
  };

  public shared ({ caller }) func createListing(_id : Text, _title : Text, _description : Text, _originalPrice : Float, _dealPrice : Float, _category : Category, _imageUrl : Text, _stockQuantity : Int, _expiryTimestamp : ?Int, pin : Text) : async () {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };

    let listing : Listing = {
      id = _id;
      title = _title;
      description = _description;
      originalPrice = _originalPrice;
      dealPrice = _dealPrice;
      category = _category;
      imageUrl = _imageUrl;
      stockQuantity = _stockQuantity;
      expiryTimestamp = _expiryTimestamp;
      isActive = true;
    };

    listings.add(_id, listing);
  };

  public shared ({ caller }) func updateListing(_id : Text, _title : Text, _description : Text, _originalPrice : Float, _dealPrice : Float, _category : Category, _imageUrl : Text, _stockQuantity : Int, _expiryTimestamp : ?Int, pin : Text) : async () {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };

    let listing : Listing = {
      id = _id;
      title = _title;
      description = _description;
      originalPrice = _originalPrice;
      dealPrice = _dealPrice;
      category = _category;
      imageUrl = _imageUrl;
      stockQuantity = _stockQuantity;
      expiryTimestamp = _expiryTimestamp;
      isActive = true;
    };

    listings.add(_id, listing);
  };

  public shared ({ caller }) func deleteListing(id : Text, pin : Text) : async () {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };
    listings.remove(id);
  };

  public shared ({ caller }) func toggleListingActive(id : Text, pin : Text) : async () {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };

    switch (listings.get(id)) {
      case (?listing) {
        let updatedListing = {
          listing with
          isActive = not listing.isActive;
        };
        listings.add(id, updatedListing);
      };
      case (null) { Runtime.trap("Listing not found") };
    };
  };

  public shared ({ caller }) func placeOrder(id : Text, listingId : Text, customerName : Text, customerPhone : Text, customerAddress : Text, quantity : Int, timestamp : Int) : async () {
    let order : Order = {
      id;
      listingId;
      customerName;
      customerPhone;
      customerAddress;
      quantity;
      timestamp;
      status = #pending;
    };

    orders.add(id, order);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus, pin : Text) : async () {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };

    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = {
          order with
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getAllListings() : async [Listing] {
    listings.values().toArray();
  };

  public query ({ caller }) func getListing(id : Text) : async ?Listing {
    listings.get(id);
  };

  public query ({ caller }) func getActiveListings() : async [Listing] {
    listings.values().toArray().filter(func(listing) { listing.isActive });
  };

  public query ({ caller }) func getAllOrders(pin : Text) : async [Order] {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrder(orderId : Text, pin : Text) : async ?Order {
    if (pin != adminPin) { Runtime.trap("Unauthorized access") };
    orders.get(orderId);
  };
};
