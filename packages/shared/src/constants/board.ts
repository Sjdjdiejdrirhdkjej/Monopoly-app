import { Tile, TileKind, ColorGroup } from '../types'

export const BOARD_SIZE = 40

const prop = (i: number, name: string, group: ColorGroup, price: number, rents: number[], houseCost: number): Tile => ({
  index: i,
  kind: TileKind.Property,
  name,
  color: group,
  price,
  rents,
  houseCost
})

const rr = (i: number, name: string, price: number): Tile => ({ index: i, kind: TileKind.Railroad, name, price })

const util = (i: number, name: string, price: number): Tile => ({ index: i, kind: TileKind.Utility, name, price })

const tax = (i: number, name: string, amount: number): Tile => ({ index: i, kind: TileKind.Tax, name, amount })

const special = (i: number, kind: TileKind, name: string): Tile => ({ index: i, kind, name })

export const BOARD: Tile[] = [
  special(0, TileKind.Go, 'Go'),
  prop(1, 'Brown-1', 'Brown', 60, [2, 10, 30, 90, 160, 250], 50),
  special(2, TileKind.CommunityChest, 'Community'),
  prop(3, 'Brown-2', 'Brown', 60, [4, 20, 60, 180, 320, 450], 50),
  tax(4, 'Income Tax', 200),
  rr(5, 'Railroad-1', 200),
  prop(6, 'LightBlue-1', 'LightBlue', 100, [6, 30, 90, 270, 400, 550], 50),
  special(7, TileKind.Chance, 'Chance'),
  prop(8, 'LightBlue-2', 'LightBlue', 100, [6, 30, 90, 270, 400, 550], 50),
  prop(9, 'LightBlue-3', 'LightBlue', 120, [8, 40, 100, 300, 450, 600], 50),
  special(10, TileKind.Jail, 'Jail/Just Visiting'),
  prop(11, 'Purple-1', 'Purple', 140, [10, 50, 150, 450, 625, 750], 100),
  util(12, 'Utility-1', 150),
  prop(13, 'Purple-2', 'Purple', 140, [10, 50, 150, 450, 625, 750], 100),
  prop(14, 'Purple-3', 'Purple', 160, [12, 60, 180, 500, 700, 900], 100),
  rr(15, 'Railroad-2', 200),
  prop(16, 'Orange-1', 'Orange', 180, [14, 70, 200, 550, 750, 950], 100),
  special(17, TileKind.CommunityChest, 'Community'),
  prop(18, 'Orange-2', 'Orange', 180, [14, 70, 200, 550, 750, 950], 100),
  prop(19, 'Orange-3', 'Orange', 200, [16, 80, 220, 600, 800, 1000], 100),
  special(20, TileKind.FreeParking, 'Free Parking'),
  prop(21, 'Red-1', 'Red', 220, [18, 90, 250, 700, 875, 1050], 150),
  special(22, TileKind.Chance, 'Chance'),
  prop(23, 'Red-2', 'Red', 220, [18, 90, 250, 700, 875, 1050], 150),
  prop(24, 'Red-3', 'Red', 240, [20, 100, 300, 750, 925, 1100], 150),
  rr(25, 'Railroad-3', 200),
  prop(26, 'Yellow-1', 'Yellow', 260, [22, 110, 330, 800, 975, 1150], 150),
  prop(27, 'Yellow-2', 'Yellow', 260, [22, 110, 330, 800, 975, 1150], 150),
  util(28, 'Utility-2', 150),
  prop(29, 'Yellow-3', 'Yellow', 280, [24, 120, 360, 850, 1025, 1200], 150),
  special(30, TileKind.GoToJail, 'Go To Jail'),
  prop(31, 'Green-1', 'Green', 300, [26, 130, 390, 900, 1100, 1275], 200),
  prop(32, 'Green-2', 'Green', 300, [26, 130, 390, 900, 1100, 1275], 200),
  special(33, TileKind.CommunityChest, 'Community'),
  prop(34, 'Green-3', 'Green', 320, [28, 150, 450, 1000, 1200, 1400], 200),
  rr(35, 'Railroad-4', 200),
  special(36, TileKind.Chance, 'Chance'),
  prop(37, 'DarkBlue-1', 'DarkBlue', 350, [35, 175, 500, 1100, 1300, 1500], 200),
  tax(38, 'Luxury Tax', 100),
  prop(39, 'DarkBlue-2', 'DarkBlue', 400, [50, 200, 600, 1400, 1700, 2000], 200)
]

export const GROUPS: Record<ColorGroup, number[]> = {
  Brown: [1, 3],
  LightBlue: [6, 8, 9],
  Purple: [11, 13, 14],
  Orange: [16, 18, 19],
  Red: [21, 23, 24],
  Yellow: [26, 27, 29],
  Green: [31, 32, 34],
  DarkBlue: [37, 39]
}

export const RAILROADS = [5, 15, 25, 35]
export const UTILITIES = [12, 28]
export const GO_POSITION = 0
export const JAIL_POSITION = 10
export const FREE_PARKING = 20
export const GO_TO_JAIL = 30
