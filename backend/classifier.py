def classify_ticket(message):

    message = message.lower()

    category = "general"
    priority = "normal"

    # Payment issues
    if any(word in message for word in ["payment", "refund", "charged"]):
        category = "payment"
        priority = "high"

    # Return or damaged product
    elif any(word in message for word in ["damaged", "broken", "return"]):
        category = "return"
        priority = "high"

    # Cancellation requests
    elif any(word in message for word in ["cancel", "cancellation"]):
        category = "cancellation"

    # Delivery and tracking issues
    elif any(word in message for word in [
        "delivery",
        "tracking",
        "delivered",
        "shipment",
        "shipped",
        "courier",
        "package",
        "parcel",
        "not delivered"
    ]):
        category = "delivery"

    # Order-related queries
    elif any(word in message for word in [
        "order",
        "confirmation",
        "order status"
    ]):
        category = "order"

    return {
        "category": category,
        "priority": priority
    }


print(classify_ticket("where is my order?"))
print(classify_ticket("My payment was deducted twice"))
print(classify_ticket("I received a damaged product"))
print(classify_ticket("I have a question"))