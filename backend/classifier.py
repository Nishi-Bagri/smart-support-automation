def classify_ticket(message):

    message = message.lower()

    # Default values

    category = "general"
    priority = "normal"

    #Write your classification conditions here
    if any(word in message for word in ["payment", "refund", "charged"]):
        category = "payment"
        priority = "high"

    elif any(word in message for word in ["damaged", "broken", "return"]):
        category = "return"
        priority = "high"

    elif any(word in message for word in ["cancel", "cancellation"]):
        category = "cancellation"

    elif any(word in message for word in ["order", "delivery", "tracking"]):
        category = "delivery"

    return {
        "category": category,
        "priority": priority
    }

print(classify_ticket("where is my order?"))
print(classify_ticket("My payment was deducted twice"))
print(classify_ticket("I recevived a damaged product"))
print(classify_ticket("I have a question"))