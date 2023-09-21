import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CheckCreateBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    req.params.created_by = { id: req.user.id };

    return req.params;
  },
);
