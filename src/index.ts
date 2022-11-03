import assert from 'assert';

export const STACK_API_ENDPOINTS = {
  TRACK: 'https://www.stack-so/api/v1/track',
};

export const STACK_CLIENT_ERRORS = {
  NO_API_KEY_PROVIDED: 'StackClient: No API key provided',
  INVALID_API_KEY: 'StackClient: Invalid API key provided',
  NO_ACTIVITY_TYPE_PROVIDED: 'StackClient: Activity type is required',
  INVALID_ACTIVITY_TYPE_PROVIDED: 'StackClient: Activity type must be a string',
  INVALID_ACTIVITY_PROVIDED: 'StackClient: Invalid activity provided',
  UNEXPECTED_SERVER_RESPONSE: 'StackClient: Unexpected server response',
};

export type ClientConfig = {
  key: string;
  network?: string;
};

export type Activity = {
  actor?: ActivityObjectType;
  object?: ActivityObjectType;
};

export interface ActivityObjectType {
  address?: string;
  network?: string;
  id?: string | number;
  type?: string;
  transactionHash?: string;
  extra?: any;
}

export type LoggableActivityType = {
  type: string;
  published: number;
  network?: string;
  actor?: ActivityObjectType;
  object?: ActivityObjectType;
  extra?: any;
};

export class StackClient {
  config: ClientConfig;

  constructor(config: ClientConfig) {
    this.validateConfig(config);
    this.config = config;
  }

  async track(
    type: string,
    activity?: Activity
  ): Promise<LoggableActivityType> {
    this.validateActivityType(type);

    if (activity) {
      this.validateActivity(activity);
    }

    const published = this.getCurrentTime();

    const loggableActivity: LoggableActivityType = {
      type,
      published,
      ...activity,
    };

    try {
      await this.logActivity(loggableActivity);
    } catch (e) {
      // Just log to the console.
      console.error(e);
    }

    return loggableActivity;
  }

  private async logActivity(loggableActivity: LoggableActivityType) {
    const logResponse = await fetch(STACK_API_ENDPOINTS.TRACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.key}`,
      },
      body: JSON.stringify(loggableActivity),
    });

    const logResult = await logResponse.json();

    const { success } = logResult;
    assert(success, STACK_CLIENT_ERRORS.UNEXPECTED_SERVER_RESPONSE);
  }

  private getCurrentTime(): number {
    const published = Date.now();
    return published;
  }

  private validateActivity(activity: Activity) {
    const VALID_ACTIVITIES = ['actor', 'object'];
    const activityKeys = Object.keys(activity);
    assert(
      activityKeys.length <= VALID_ACTIVITIES.length,
      STACK_CLIENT_ERRORS.INVALID_ACTIVITY_PROVIDED
    );
    for (let i = 0; i < activityKeys.length; i++) {
      assert(
        VALID_ACTIVITIES.includes(activityKeys[i]),
        STACK_CLIENT_ERRORS.INVALID_ACTIVITY_PROVIDED
      );
    }
  }

  private validateActivityType(type: string) {
    assert(Boolean(type), STACK_CLIENT_ERRORS.NO_ACTIVITY_TYPE_PROVIDED);
    assert(
      typeof type === 'string',
      STACK_CLIENT_ERRORS.INVALID_ACTIVITY_TYPE_PROVIDED
    );
  }

  private validateConfig(config: ClientConfig) {
    assert(Boolean(config.key), STACK_CLIENT_ERRORS.NO_API_KEY_PROVIDED);
    assert(typeof config.key === 'string', STACK_CLIENT_ERRORS.INVALID_API_KEY);
  }
}

export function initStack(key: string): StackClient {
  const stack_ = new StackClient({ key });
  return stack_;
}
