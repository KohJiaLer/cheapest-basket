import type {
    BasketItem,
    BasketOption,
    Shop,
} from "../../types/basket";

type RecommendationPanelProps = {
    recommendation: BasketOption | null;
    shops: Shop[];
    items: BasketItem[];
    hasCalculated: boolean;
};

export default function RecommendationPanel({
    recommendation,
    shops,
    items,
    hasCalculated,
}: RecommendationPanelProps) {

    if (!hasCalculated) {
        return (
            <p className="empty-message">
                Enter your basket and prices, then find the cheapest option.
            </p>
        );
    }

    if (!recommendation) {
        return (
        <p className="error-message">
            No available shop or two-shop combination can supply the complete basket.
        </p>
        );
    }

    function getShopName(shopId: string) {
        return (
            shops.find((shop) => shop.id === shopId)?.name ??
            "Unknown shop"
        );
    }

    function getItemName(itemId: string) {
        return (
            items.find((item) => item.id === itemId)?.name ??
            "Unknown item"
        );
    }

    return (
        <div className="recommendation-result">
            <h3>Recommended option</h3>

            <p>
                {recommendation.shopIds.length === 1
                    ? `Buy everything from ${getShopName(
                        recommendation.shopIds[0],
                    )}.`
                    : `Split your basket between ${recommendation.shopIds
                        .map(getShopName)
                        .join(" and ")}.`}
            </p>

            <div className="recommendation-shops">
                {recommendation.shopIds.map((shopId) => (
                    <div
                        className="recommendation-shop"
                        key={shopId}
                    >
                        <h4>{getShopName(shopId)}</h4>

                        <ul>
                            {recommendation.assignments
                                .filter(
                                (assignment) =>
                                    assignment.shopId === shopId,
                                )
                                .map((assignment) => (
                                <li key={assignment.itemId}>
                                    <span>
                                        {getItemName(
                                            assignment.itemId,
                                        )}{" "}
                                        x {assignment.quantity}
                                    </span>

                                    <span>
                                        RM
                                        {assignment.totalPrice.toFixed(
                                            2,
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="recommendation-summary">
                <p>
                    <span>Items subtotal</span>
                    <strong>
                        RM
                        {recommendation.itemSubTotal.toFixed(
                        2,
                        )}
                    </strong>
                </p>

                <p>
                    <span>Extra trip cost</span>
                    <strong>
                        RM
                        {recommendation.extraTripCost.toFixed(
                        2,
                        )}
                    </strong>
                </p>

                <p className="recommendation-total">
                    <span>Final total</span>
                    <strong>
                        RM
                        {recommendation.finalTotal.toFixed(
                        2,
                        )}
                    </strong>
                </p>
            </div>
        </div>
    );
}