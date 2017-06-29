export abstract class ParameterHandler<T, U = T> {
  static buildDefault<T>(value: T): ParameterHandler<T> {
    return new DefaultParameterHandler(value);
  }

  constructor(public value: T) {}

  public abstract compute(): U;
}

class DefaultParameterHandler<T> extends ParameterHandler<T> {
  compute(): T {
    return this.value;
  }
}

export class ParameterRangeHandler extends DefaultParameterHandler<number> {
  constructor(value: number, public min: number, public max: number, public step: number) {
    super(value);
  }

  private computeNormalizedValue(value: number): number {
    return Math.min(Math.max(value - (value - this.min) % this.step, this.min), this.max);
  }

  isMax(): boolean {
    return Number.parseFloat(this.value.toString()) + this.step > this.max;
  }

  isMin(): boolean {
    return Number.parseFloat(this.value.toString()) - this.step < this.min;
  }

  setValue(value: number): void {
    this.value = this.computeNormalizedValue(value);
  }

  normalize(): number {
    this.value = this.computeNormalizedValue(this.value);
    return this.value;
  }

  normalizedValue(): number {
    return this.computeNormalizedValue(this.value);
  }
}

export class ParameterControl {
  constructor(public title: string,
              public unit: string,
              public value: ParameterRangeHandler) {
    this.title = this.title.toUpperCase();
  }
}
