"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _presetEnv = _interopRequireDefault(require("@babel/preset-env"));

var _pluginProposalFunctionBind = _interopRequireDefault(require("@babel/plugin-proposal-function-bind"));

var _pluginProposalExportDefaultFrom = _interopRequireDefault(require("@babel/plugin-proposal-export-default-from"));

var _pluginProposalLogicalAssignmentOperators = _interopRequireDefault(require("@babel/plugin-proposal-logical-assignment-operators"));

var _pluginProposalOptionalChaining = _interopRequireDefault(require("@babel/plugin-proposal-optional-chaining"));

var _pluginProposalPipelineOperator = _interopRequireDefault(require("@babel/plugin-proposal-pipeline-operator"));

var _pluginProposalNullishCoalescingOperator = _interopRequireDefault(require("@babel/plugin-proposal-nullish-coalescing-operator"));

var _pluginProposalDoExpressions = _interopRequireDefault(require("@babel/plugin-proposal-do-expressions"));

var _pluginProposalDecorators = _interopRequireDefault(require("@babel/plugin-proposal-decorators"));

var _pluginProposalFunctionSent = _interopRequireDefault(require("@babel/plugin-proposal-function-sent"));

var _pluginProposalExportNamespaceFrom = _interopRequireDefault(require("@babel/plugin-proposal-export-namespace-from"));

var _pluginProposalNumericSeparator = _interopRequireDefault(require("@babel/plugin-proposal-numeric-separator"));

var _pluginProposalThrowExpressions = _interopRequireDefault(require("@babel/plugin-proposal-throw-expressions"));

var _pluginSyntaxDynamicImport = _interopRequireDefault(require("@babel/plugin-syntax-dynamic-import"));

var _pluginSyntaxImportMeta = _interopRequireDefault(require("@babel/plugin-syntax-import-meta"));

var _pluginProposalClassProperties = _interopRequireDefault(require("@babel/plugin-proposal-class-properties"));

var _pluginProposalJsonStrings = _interopRequireDefault(require("@babel/plugin-proposal-json-strings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var _default = {
  presets: [[_presetEnv.default, {
    targets: {
      node: '10.2.0'
    }
  }]],
  plugins: [// @babel/stage-0 181212
  _pluginProposalFunctionBind.default, // Stage 0
  _pluginProposalExportDefaultFrom.default, // Stage 1
  _pluginProposalLogicalAssignmentOperators.default, [_pluginProposalOptionalChaining.default, {
    loose: false
  }], [_pluginProposalPipelineOperator.default, {
    proposal: 'minimal'
  }], [_pluginProposalNullishCoalescingOperator.default, {
    loose: false
  }], _pluginProposalDoExpressions.default, [_pluginProposalDecorators.default, {
    legacy: true
  }], // Stage 2
  _pluginProposalFunctionSent.default, _pluginProposalExportNamespaceFrom.default, _pluginProposalNumericSeparator.default, _pluginProposalThrowExpressions.default, _pluginSyntaxDynamicImport.default, // Stage 3
  _pluginSyntaxImportMeta.default, [_pluginProposalClassProperties.default, {
    loose: false
  }], _pluginProposalJsonStrings.default]
};
exports.default = _default;