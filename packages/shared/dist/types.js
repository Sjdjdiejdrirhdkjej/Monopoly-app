export var TileKind;
(function (TileKind) {
    TileKind["Go"] = "Go";
    TileKind["Property"] = "Property";
    TileKind["Railroad"] = "Railroad";
    TileKind["Utility"] = "Utility";
    TileKind["Tax"] = "Tax";
    TileKind["Chance"] = "Chance";
    TileKind["CommunityChest"] = "CommunityChest";
    TileKind["Jail"] = "Jail";
    TileKind["FreeParking"] = "FreeParking";
    TileKind["GoToJail"] = "GoToJail";
})(TileKind || (TileKind = {}));
export var Phase;
(function (Phase) {
    Phase["Setup"] = "Setup";
    Phase["TurnStart"] = "TurnStart";
    Phase["PreRoll"] = "PreRoll";
    Phase["Rolling"] = "Rolling";
    Phase["Move"] = "Move";
    Phase["Resolve"] = "Resolve";
    Phase["BuyDecision"] = "BuyDecision";
    Phase["Auction"] = "Auction";
    Phase["Trade"] = "Trade";
    Phase["BuildSell"] = "BuildSell";
    Phase["EndTurn"] = "EndTurn";
    Phase["GameOver"] = "GameOver";
})(Phase || (Phase = {}));
export var CardKind;
(function (CardKind) {
    CardKind["MoveTo"] = "MoveTo";
    CardKind["MoveToNearestRailroad"] = "MoveToNearestRailroad";
    CardKind["MoveToNearestUtility"] = "MoveToNearestUtility";
    CardKind["Pay"] = "Pay";
    CardKind["Receive"] = "Receive";
    CardKind["PayEachPlayer"] = "PayEachPlayer";
    CardKind["GoToJail"] = "GoToJail";
    CardKind["GetOutOfJail"] = "GetOutOfJail";
    CardKind["Repairs"] = "Repairs";
})(CardKind || (CardKind = {}));
//# sourceMappingURL=types.js.map