import { DataType } from '../interfaces';
import { _IType } from '../interfaces-private';
import { Box, Circle, Line, Path, Point, Polygon, Segment } from 'pgsql-ast-parser';
import { Evaluator } from '../evaluator';
import { TypeBase } from './datatype-base';
export declare function pointToStr(p: Point): string;
export declare function pointEq(a: Point, b: Point): boolean;
export declare class PointType extends TypeBase<Point> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Point>, to: _IType): Evaluator<Point>;
    doEquals(a: Point, b: Point): boolean;
    doGt(a: Point, b: Point): boolean;
    doLt(a: Point, b: Point): boolean;
}
export declare class LineType extends TypeBase<Line> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Line>, to: _IType): Evaluator<Line>;
    doEquals(a: Line, b: Line): boolean;
}
export declare class LsegType extends TypeBase<Segment> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Segment>, to: _IType): Evaluator<Segment>;
    doEquals([as, ae]: Segment, [bs, be]: Segment): boolean;
}
export declare class BoxType extends TypeBase<Box> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Box>, to: _IType): Evaluator<Box>;
    doEquals([as, ae]: Box, [bs, be]: Box): boolean;
}
export declare class PathType extends TypeBase<Path> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Path>, to: _IType): Evaluator<Path>;
    doEquals(a: Path, b: Path): boolean;
}
export declare class PolygonType extends TypeBase<Polygon> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Polygon>, to: _IType): Evaluator<Polygon>;
    doEquals(a: Polygon, b: Polygon): boolean;
}
export declare class CircleType extends TypeBase<Circle> {
    get primary(): DataType;
    get name(): string;
    doCanCast(t: _IType): boolean;
    doCast(value: Evaluator<Circle>, to: _IType): Evaluator<Circle>;
    doEquals(a: Circle, b: Circle): boolean;
}
//# sourceMappingURL=datatypes-geometric.d.ts.map